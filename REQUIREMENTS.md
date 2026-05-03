# Gear Search App Requirements

## Goal

All in one search tool that quickly finds listings across multiple sites in Japan for used and new electronic music instruments. A one stop portal to find used electronic music gear in Japan. Vintage synthesizer heads welcome.

## Must-Have Features

- Search active auctions and listings in Japan
- Saved searches
- Email alerts for new listings based on saved search keywords
- Pull in the main thumbnail on each listing
- Clean UI design that feels polished, Mac-native, and media-forward
- Large thumbnails for quick visual scanning of result lists

## Nice-to-Have Features

- Link directly to live listings from the app and email alerts
- Color-coded search results
- Clean iconography

## First Target Sources

- Mercari
- Yahoo Auctions
- Yahoo Fleamarket
- Rakuma
- Digimart
- OFFMALL
- Five G
- implant4
- Hard Off

## Example Saved Searches

### Waldorf

Terms:

- Waldorf
- ワルドルフ
- WALDORF

Exclude:

- manual
- magnet
- power cord
- doll
- Fashionist
- shirt
- CD
- Moments to Remember
- record
- shoes

Max price: ¥2,000,000

Alert rule:

- Immediate alert for any new listing

## Alerts

- Immediate
- Hourly
- Daily
- Desktop notification
- Email
- Mobile later

## Workflow

- Utility app checked daily 1-3 times

## Scraping / Automation Comfort Level

- browser automation plus respectful rate-limited scraping

## Future iPhone Version

- Build the initial app in a way that it can later be ported to iPhone

## App Name Ideas

- bumpers

## Implementation Assumptions

- Build the first version as a local-first responsive web app for Mac desktop.
- Use a connector-based backend so each source can be added or repaired independently.
- Store saved searches, listings, seen listing IDs, hidden listings, and alert state locally.
- Treat email alerts as a first-class feature, but start with in-app new item detection while connector behavior is being validated.
- Prioritize sources that are gear-relevant and technically tractable before harder marketplace connectors.
