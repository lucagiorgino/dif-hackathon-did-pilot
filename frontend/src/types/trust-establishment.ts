// import { DidReview } from "./types"

export type Topics = {
  [key: string]: {
    [key: string]: unknown
  }
}

export type Entries = {
  [key: string]: Topics
}

export type TrustEstablishmentDocument = {
  id: string
  author: string
  created: string
  validFrom?: string
  validUntil?: string
  version: string
  entries: Entries
}

export const TrustEstrablishmentDocumentSchema = {
  "required": [
    "id",
    "author"
  ],
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "id": {
      "description": "Trust Establishment Document unique identifier",
      "type": "string"
    },
    "author": {
      "description": "Trust Establishment Document author",
      "type": "string",
      "format": "uri",
      "pattern": "^did:([a-z]+):([a-zA-Z0-9_.-]+)(:([a-zA-Z0-9_.-]+))?(:([a-zA-Z0-9_.-]+))?(:([a-zA-Z0-9_.-]+))?$"
    },
    "created": {
      "description": "Trust Establishment Document creation date",
      "type": "string",
      "format": "date-time"
    },
    "validFrom": {
      "description": "Trust Establishment Document validity start date",
      "type": "string",
      "format": "date-time"
    },
    "validUntil": {
      "description": "Trust Establishment Document validity end date",
      "type": "string",
      "format": "date-time"
    },
    "version": {
      "description": "Trust Establishment Document version",
      "type": "string",
      "pattern": "^[0-9].[0-9].[0-9]$"
    },
    "entries": {
      "description": "Trust Establishment Document entries",
      "type": "object",
      // "additionalProperties": false,
      "patternProperties": {
        "^[a-z]$": {
          "description": "Trust Establishment Document entry",
          "type": "object",
          "additionalProperties": false,
          "patternProperties": {
            "^did:([a-z]+):([a-zA-Z0-9_.-]+)(:([a-zA-Z0-9_.-]+))?(:([a-zA-Z0-9_.-]+))?(:([a-zA-Z0-9_.-]+))?$": {
              "type": "object",
              "additionalProperties": false,
              "description": "Trust Establishment Document entry review",
              "properties": {
                "subjectDid": {
                  "description": "Trust Establishment Document entry review subject DID",
                  "type": "string"
                },
                "stars": {
                  "description": "Trust Establishment Document entry review stars",
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 5
                },
                "description": {
                  "description": "Trust Establishment Document entry review description",
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
}