const fs = require('fs');

const file = '/Users/pulseplay/thrico/thrico-entity-dashboard/graphql/actions/events/index.ts';
let content = fs.readFileSync(file, 'utf8');

const mapping = {
  'GET_EVENT_SPEAKERS': 'addEventSpeaker',
  'GET_EVENT_SPONSORSHIPS': 'addEventSponsor', // Note: useAddEventSponsor and useAddEventSponsorship both use GET_EVENT_SPONSORSHIPS
  'GET_EVENT_VENUES': 'addEventVenue',
  'GET_EVENT_AGENDAS': 'addEventAgenda',
  'GET_EVENT_TICKETS': 'addEventTicket',
  'GET_EVENT_PROMO_CODES': 'addEventPromoCode',
};

// Actually, wait, useAddEventSponsorship returns `addEventSponsorship`.
// Let's just do a regex replace for the pattern:
// refetchQueries: [
//   {
//     query: QUERY_NAME,
//     variables: { eventId: options?.variables?.input?.eventId },
//   },
// ]

const regex = /refetchQueries:\s*\[\s*\{\s*query:\s*([A-Z_]+),\s*variables:\s*\{\s*eventId:\s*options\?\.variables\?\.input\?\.eventId\s*\},\s*\},\s*\],/g;

content = content.replace(regex, (match, queryName) => {
  // Try to guess the mutation name from the query name
  // e.g. GET_EVENT_SPEAKERS -> addEventSpeaker
  // GET_EVENT_TICKETS -> addEventTicket
  let returnField = 'addEvent';
  if (queryName === 'GET_EVENT_SPEAKERS') returnField = 'addEventSpeaker';
  if (queryName === 'GET_EVENT_SPONSORSHIPS') {
    // Both useAddEventSponsorship and useAddEventSponsor use this!
    // we can just use `result.data?.[Object.keys(result.data)[0]]?.eventId` to be safe!
    returnField = 'Object.values(result.data || {})[0]';
  } else if (queryName === 'GET_EVENT_VENUES') returnField = 'addEventVenue';
  else if (queryName === 'GET_EVENT_AGENDAS') returnField = 'addEventAgenda';
  else if (queryName === 'GET_EVENT_TICKETS') returnField = 'addEventTicket';
  else if (queryName === 'GET_EVENT_PROMO_CODES') returnField = 'addEventPromoCode';
  else if (queryName === 'GET_EVENTS') returnField = 'addEvent';
  
  return `refetchQueries: (result) => {
      const updatedId = result.data ? Object.values(result.data)[0]?.eventId : options?.variables?.input?.eventId;
      if (updatedId) {
        return [
          {
            query: ${queryName},
            variables: { eventId: updatedId },
          },
        ];
      }
      return [];
    },`;
});

// For GET_EVENTS inside useAddEvent and useDeleteEvent
const regexEvents = /refetchQueries:\s*\[\s*\{\s*query:\s*GET_EVENTS,\s*variables:\s*\{\s*input:\s*\{\s*status:\s*"ALL",\s*\},\s*\},\s*\},\s*\],/g;
content = content.replace(regexEvents, `refetchQueries: [{ query: GET_EVENTS, variables: { input: { status: "ALL" } } }],`);


fs.writeFileSync(file, content);
console.log('Fixed');
