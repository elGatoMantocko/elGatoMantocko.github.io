# its expected that the route53 mantock.com zone already exists
data "aws_route53_zone" "mantock" {
  name = "mantock.com"
}

resource "aws_route53_record" "root_a" {
  zone_id = data.aws_route53_zone.mantock.zone_id
  name    = "mantock.com"
  type    = "A"
  ttl     = 14400
  records = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ]
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.mantock.zone_id
  name    = "www.mantock.com"
  type    = "CNAME"
  ttl     = 14400
  records = ["elgatomantocko.github.io"]
}

resource "aws_route53_record" "elliott" {
  zone_id = data.aws_route53_zone.mantock.zone_id
  name    = "elliott.mantock.com"
  type    = "CNAME"
  ttl     = 14400
  records = ["elgatomantocko.github.io"]
}

resource "aws_route53_record" "github_pages_challenge_root" {
  zone_id = data.aws_route53_zone.mantock.zone_id
  name    = "_github-pages-challenge-elgatomantocko.mantock.com"
  type    = "TXT"
  ttl     = 14400
  records = ["5dd9b626ac2a3d63b6c7a5e472dfe7"]
}

resource "aws_route53_record" "github_pages_challenge_elliott" {
  zone_id = data.aws_route53_zone.mantock.zone_id
  name    = "_github-pages-challenge-elgatomantocko.elliott.mantock.com"
  type    = "TXT"
  ttl     = 14400
  records = ["589495f921a878ef91a7e61beb8993"]
}
