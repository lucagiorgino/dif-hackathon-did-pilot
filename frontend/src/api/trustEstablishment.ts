import {
  Entries, 
  TrustEstablishmentDocument, 
  PartialTrustEstrablishmentDocumentSchema, 
  GenericEntryPropertiesPattern 
} from "@/types/trust-establishment";
import Ajv from "ajv"
import addFormats from "ajv-formats"
import { v4 as uuidv4 } from "uuid";

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

type TrustEstablishmentDocumentOptions = {
  author: string
  version: string
  entries: Entries
  validFrom?: string
  validUntil?: string
}

const testValidation = () => {
  const validate = ajv.compile(getTrustEstablishmentDocumentSchema())
  const valid = validate(data)
  if (!valid) {
    console.log(validate.errors)
  } else {
    const document = data as TrustEstablishmentDocument
    console.log(document)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrustEstablishmentDocumentSchema = (properties?: object): any => {
  const complete_schema = PartialTrustEstrablishmentDocumentSchema
  if (!properties) {
    complete_schema.properties.entries = {
      ...complete_schema.properties.entries,
      ...GenericEntryPropertiesPattern
    }
  } else {
    complete_schema.properties.entries = {
      ...complete_schema.properties.entries,
      ...properties
    }
  }
  return complete_schema
}

const createTrustEstablishmentDocument = (options: TrustEstablishmentDocumentOptions): TrustEstablishmentDocument => {
  return {
    id: uuidv4(),
    created: new Date().toISOString(),
    ...options
  }
}

const validateTrustEstablishmentDocument = (document: TrustEstablishmentDocument, entries_definition: object): boolean => {
  const validate = ajv.compile(getTrustEstablishmentDocumentSchema(entries_definition ? entries_definition : undefined))
  const valid = validate(document)
  if (!valid) {
    console.log(validate.errors)
    return false
  } else {
    console.log("Trust Establishment Document is valid")
    return true
  }
}

const trustEstablishmentDocumentAPI = { createTrustEstablishmentDocument, validateTrustEstablishmentDocument, testValidation };
export default trustEstablishmentDocumentAPI;
