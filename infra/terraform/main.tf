terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_rds_cluster" "inventory" {
  cluster_identifier = "inventory-db"
  engine             = "aurora-postgresql"
  master_username    = "postgres"
  master_password    = var.db_password
}

resource "aws_elasticache_replication_group" "inventory" {
  replication_group_id          = "inventory-redis"
  replication_group_description = "Redis for service inventory"
  node_type                     = "cache.t4g.micro"
  num_node_groups               = 1
  replicas_per_node_group       = 1
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "db_password" {
  type      = string
  sensitive = true
}
