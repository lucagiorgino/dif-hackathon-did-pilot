export const reviewProtocolDefinition = {
  "protocol": "https://didpilot.io",
  "published": true,
  "types": {
    "interaction": {
      "schema": "https://didpilot.io/schemas/interaction",
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
    "interaction": {
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
          {
            "who": "author",
            "of": "interaction",
            "can": "write"
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