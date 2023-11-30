export const reviewProtocolDefinition = {
  "protocol": "https://dif-pilot.example.io/did-pilot-protocol.json",
  "published": true,
  "types": {
    "interaction": {
      "schema": "https://dif-pilot.example.io/schemas/interaction",
      "dataFormats": [
        "text/plain"
      ]
    },
    "review": {
      "schema": "https://dif-pilot.example.io/schemas/review",
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