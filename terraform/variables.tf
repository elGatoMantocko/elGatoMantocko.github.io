variable "github_token" {
  description = "GitHub personal access token with repo and pages permissions"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region for the provider (Route 53 is global but a region is required)"
  type        = string
  default     = "us-east-1"
}
