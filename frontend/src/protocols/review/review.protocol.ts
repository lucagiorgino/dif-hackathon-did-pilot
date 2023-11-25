export const reviewProtocolDefinition = {
  "protocol": "https://didpilot.io",
  "published": true,
  "types": {
    "profile": {
      "schema": "https://didpilot.io/schemas/profile",
      "dataFormats": [
        "application/json"
      ]
    },
    "review": {
      "schema": "https://didpilot.io/schemas/review",
      "dataFormats": [
        "application/json"
      ]
    }
  },
  "structure": {
    "profile": {
      "$actions": [
        {
          "who": "anyone",
          "can": "read"
        },
        {
          "who": "anyone",
          "can": "write"
        }
      ],
      "review": {
        "$actions": [
          {
            "who": "anyone",
            "can": "read"
          },
          // maybe this is not needed
          {
            "who": "author",
            "of": "profile",
            "can": "read"
          },
          {
            "who": "author",
            "of": "review",
            "can": "write"
          }
        ]
      }
    }
  }
}