const nlp = require('compromise')

function extractPhrases(text) {
  let doc = nlp(text)
  
  // Extract noun phrases
  let nounPhrases = doc.match('#Determiner? #Adjective* #Noun+').out('array')
  
  // Extract named entities
  let people = doc.people().out('array')
  let places = doc.places().out('array')
  let organizations = doc.organizations().out('array')

  // You can also get all named entities at once
  let allEntities = doc.topics().out('array')

  return {
    nounPhrases: nounPhrases,
    namedEntities: {
      people: people,
      places: places,
      organizations: organizations,
      all: allEntities
    }
  }
}

// Example usage
let text = "John Smith works at Apple Inc. in New York City. He loves the tall skyscrapers and busy streets."
let result = extractPhrases(text)

console.log('Noun Phrases:', result.nounPhrases)
console.log('Named Entities:')
console.log('  People:', result.namedEntities.people)
console.log('  Places:', result.namedEntities.places)
console.log('  Organizations:', result.namedEntities.organizations)
console.log('  All Entities:', result.namedEntities.all)