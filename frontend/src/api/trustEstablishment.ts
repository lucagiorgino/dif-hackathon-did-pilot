import { TrustEstablishmentDocument, TrustEstrablishmentDocumentSchema } from "@/types/trust-establishment";
import Ajv from "ajv"
import addFormats from "ajv-formats"

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const data = {
  "id": "32f54163-7166-48f1-93d8-ff217bdb0653",
  "author": "did:example:alice",
  "created": "2022-04-20T04:20:00Z",
  "version": "0.0.3",
  "entries": {
    "https://example.com/trusted-supplier.schema.json": {
      "did:example:bob": {
        "on_time_percentage": 92,
        "goods": ["basmati", "jasmine", "sushi"]
      },
      "did:example:carol": {
        "on_time_percentage": 74,
        "goods": ["long-grain", "short-grain", "extra glutinous"]
      }
    },
    "https://example.com/other.schema.json":{
      "bob": {
        "foo": "bar"
      },
      "did:example:carol": {
        "foo": "baz"
      }
    }
  }
}

export const testValidation = () => {
  const validate = ajv.compile(TrustEstrablishmentDocumentSchema)
  const valid = validate(data)
  if (!valid) {
    console.log(validate.errors)
  } else {
    const document = data as TrustEstablishmentDocument
    console.log(document)
  }
}
