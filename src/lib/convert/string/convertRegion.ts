/**
 * Converts a state or province name to its abbreviation, or abbreviation to name.
 * Input values not found in known lists will be return without conversion.
 *
 * @param input Name or abbreviation of state or province.
 * @param toName Flag to convert name to abbreviation.
 * @returns Abbreviation of stat eor province, or its name when toName is true.
 */
export function convertRegion(input: string, toName?: boolean) {
  const states = new Map([
    ["Alabama", "AL"],
    ["Alaska", "AK"],
    ["American Samoa", "AS"],
    ["Arizona", "AZ"],
    ["Arkansas", "AR"],
    ["Armed Forces Americas", "AA"],
    ["Armed Forces Europe", "AE"],
    ["Armed Forces Pacific", "AP"],
    ["California", "CA"],
    ["Colorado", "CO"],
    ["Connecticut", "CT"],
    ["Delaware", "DE"],
    ["District Of Columbia", "DC"],
    ["Florida", "FL"],
    ["Georgia", "GA"],
    ["Guam", "GU"],
    ["Hawaii", "HI"],
    ["Idaho", "ID"],
    ["Illinois", "IL"],
    ["Indiana", "IN"],
    ["Iowa", "IA"],
    ["Kansas", "KS"],
    ["Kentucky", "KY"],
    ["Louisiana", "LA"],
    ["Maine", "ME"],
    ["Marshall Islands", "MH"],
    ["Maryland", "MD"],
    ["Massachusetts", "MA"],
    ["Michigan", "MI"],
    ["Minnesota", "MN"],
    ["Mississippi", "MS"],
    ["Missouri", "MO"],
    ["Montana", "MT"],
    ["Nebraska", "NE"],
    ["Nevada", "NV"],
    ["New Hampshire", "NH"],
    ["New Jersey", "NJ"],
    ["New Mexico", "NM"],
    ["New York", "NY"],
    ["North Carolina", "NC"],
    ["North Dakota", "ND"],
    ["Northern Mariana Islands", "NP"],
    ["Ohio", "OH"],
    ["Oklahoma", "OK"],
    ["Oregon", "OR"],
    ["Pennsylvania", "PA"],
    ["Puerto Rico", "PR"],
    ["Rhode Island", "RI"],
    ["South Carolina", "SC"],
    ["South Dakota", "SD"],
    ["Tennessee", "TN"],
    ["Texas", "TX"],
    ["US Virgin Islands", "VI"],
    ["Utah", "UT"],
    ["Vermont", "VT"],
    ["Virginia", "VA"],
    ["Washington", "WA"],
    ["West Virginia", "WV"],
    ["Wisconsin", "WI"],
    ["Wyoming", "WY"],
  ]);

  // So happy that Canada and the US have distinct abbreviations
  const provinces = new Map([
    ["Alberta", "AB"],
    ["British Columbia", "BC"],
    ["Manitoba", "MB"],
    ["New Brunswick", "NB"],
    ["Newfoundland", "NF"],
    ["Newfoundland And Labrador", "NL"],
    ["Northwest Territories", "NT"],
    ["Nova Scotia", "NS"],
    ["Nunavut", "NU"],
    ["Ontario", "ON"],
    ["Prince Edward Island", "PE"],
    ["Quebec", "QC"],
    ["Saskatchewan", "SK"],
    ["Yukon", "YT"],
  ]);

  let regions = new Map([...states, ...provinces]);

  let normalizedInput = input.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
  );

  if (toName) {
    normalizedInput = input.toUpperCase();
    regions = new Map([...regions].map(([k, v]) => [v, k]));
  }

  return regions.get(normalizedInput) || input;
}

export default convertRegion;
