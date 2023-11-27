export const reviewProtocolDefinition = {
  "protocol": "https://dif-hackathon-frontend.vercel.app/",
  "published": true,
  "types": {
    "interaction": {
      "schema": "https://dif-hackathon-frontend.vercel.app//schemas/interaction",
      "dataFormats": [
        "application/json"
      ]
    },
    "review": {
      "schema": "https://dif-hackathon-frontend.vercel.app//schemas/review",
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