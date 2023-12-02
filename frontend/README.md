# DID Pilot
### The decentralized TrustPilot
This is a submission for the Decentralized Identity Foundation hackathon 2023.

## Used DIF techs
- [Decentralized Web Nodes (DWN)](https://identity.foundation/decentralized-web-node/spec/)
- [Trust Establishment](https://identity.foundation/trust-establishment/)

## Selected sponsor track
- [TBD (Block)](https://www.tbd.website/)
  - **Challenge**: Build a decentralized web app using Web5.js. We are particularly interested in your use of DWNs.
- Requirements:
  - Deployed app: https://dif-hackathon-did-pilot.vercel.app/
  - Video presentation: (TO-DO)

# What problems does DIDPilot aim to solve?

Web5 could be defined as **"the Human Centric Web"**, so how can you trust other users in the future?

Well, we think that the solution could be **Decentralized Identifiers** and **Community engagement**. From this statement, we decided to build DIDPilot.

In Web2, when you need to know whether a service is safe what do you do? 
Well, you simply search for reviews on **TrustPilot**, right? So, why not apply the same approach to Decentralized Identifiers?

We think that in an even more decentralized world, the use of **pseudonyms** can increase your privacy, but at the same time can lead you to interact with the **wrong entity**. There are many ways you might use to verify that you are interacting with the right one, but looking toward mass adoption of these technologies, DIDPilot could be a simple way to solve the problem.

## How does DIDPilot work?

Let's go into some detail.

DIDPilot works by asking its users to review each entity who they have an interaction with.
Every interaction and review is saved on the recipient DWN, so when you want to get the DID reviews, DIDPilot simply asks DID nodes to send them back.

*"Maybe here could be perfect a little diagram"*

### DIDPilot features
A user on DIDPilot can:
- search for information about a specific DID
  - get its stats (total interactions, stars average, total received reviews, first received review date, total done review)
  - read all its reviews
- get a direct summary of what others think about him
- write a review
- see his written reviews
- simulate a new interaction
- (coming soon) extract the proof from the interaction and verify that the recipient has signed a message to prove that the author had an interaction with him (so you can't put blame on a DID without having proof)

#### DWN Protocol: DIDPilot Review Protocol
We have defined a protocol to set some permissions about who can write reviews. The protocol architecture has two types:
- **interaction**: which reports the data of a connection between two DIDs
- **review**: this is the real review a DID can do about another one.

Review is set as a sub-path of an interaction and only the author and the recipient of the last one can write a review.


### Protocols, Not Standards
By thinking about what a review could be and making it more interoperable and accessible through DWNs, we believe that the **DIF Trust Establishment spec** could play a significant role in having a standard way to do attestations.

## Future steps
During the development of this project, we thought about its criticisms and there could be some problems:
- design a system to de/incentivize users to write fake/true reviews to the network (example of possible solutions: define an achievement program, add some fees to add a review and make less affordable fake ones, etc...)
- ...





