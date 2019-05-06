variable "profile" {
  type    = "string"
  default = "jg"
}

variable "region" {
  type    = "string"
  default = "eu-west-2"
}

variable "circleci-iam-username" {
  type = "string"
  default = "circleci"
}

provider "aws" {
  region  = "${var.region}"
  profile = "${var.profile}"
}

terraform {
  backend "s3" {
    bucket = "ana-terraform-state-prod"
    key    = "train-tracker-api/terraform.tfstate"
    region = "eu-west-2"
    profile = "jg"
  }
}

data "aws_iam_role" "ec2instancerole" {
  name = "EC2SystemManagerRole"
}

data "aws_ami" "amazon-linux-2" {
  most_recent = true

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm*"]
  }

  owners = ["137112412989"]
}

data "local_file" "server-cloud-init" {
  filename = "${path.module}/cloudinit.cfg"
}

data "aws_vpc" "selected" {
  id = "vpc-73cf331a"
}

resource "aws_security_group" "server_security_group" {
  name        = "train-tracker-api-server"
  description = "Allow 80 inbound traffic"
  vpc_id      = "${data.aws_vpc.selected.id}"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "all"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}

data "aws_subnet" "subnet" {
  id = "subnet-d19878aa"
}

resource "aws_instance" "server" {
  ami           = "${data.aws_ami.amazon-linux-2.id}"
  instance_type = "t3.nano"
  iam_instance_profile = "${data.aws_iam_role.ec2instancerole.name}"

  user_data = "${data.local_file.server-cloud-init.content}"

  subnet_id = "${data.aws_subnet.subnet.id}"
  vpc_security_group_ids = ["${aws_security_group.server_security_group.id}"]

  tags {
    Name = "train-tracker-api"
  }
}

resource "aws_ssm_document" "deploy-update" {
  name          = "train-tracker-api-upgrade"
  document_type = "Command"

  content = <<DOC
  {
    "schemaVersion": "1.2",
    "description": "Update the train tracker api server to the latest docker image",
    "parameters": {

    },
    "runtimeConfig": {
      "aws:runShellScript": {
        "properties": [
          {
            "id": "0.aws:runShellScript",
            "runCommand": ["sudo docker stop train-tracker-api"]
          },
          {
            "id": "0.aws:runShellScript",
            "runCommand": ["sudo docker rm train-tracker-api"]
          },          {
            "id": "0.aws:runShellScript",
            "runCommand": ["sudo docker run -p 80:3000 --log-driver=awslogs --log-opt=awslogs-group=train-tracker-api --log-opt=awslogs-create-group=true --name train-tracker-api -detach jamesgawn/train-tracker-api"]
          }
        ]
      }
    }
  }
DOC
}

resource "aws_iam_policy" "circle-ci-deploy-access" {
    name        = "train-tracker-api-deploy-access"
    path        = "/"
    description = "A policy to permit redeploying the latest version of the train-tracker-api to the EC2 instance"

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:SendCommand"
            ],
            "Resource": [
                "arn:aws:ssm:*:*:document/train-tracker-api-upgrade"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:SendCommand"
            ],
            "Resource": [
                "arn:aws:ec2:*:*:instance/*"
            ],
            "Condition": {
                "StringLike": {
                    "ssm:resourceTag/Name": [
                        "train-tracker-api"
                    ]
                }
            }
        }
    ]
}
EOF
}

resource "aws_iam_user_policy_attachment" "circel-ci-deploy-access-attachment" {
  user = "${var.circleci-iam-username}"
  policy_arn = "${aws_iam_policy.circle-ci-deploy-access.arn}"
}