export const MARATHON_FITNESS_WARRANTY_TEXT =
  "I warrant that I am physically fit and sufficiently trained to participate.";

export const MARATHON_FITNESS_WARRANTY_CHECKBOX_TEXT =
  "I warrant that I am physically fit and sufficiently trained to participate, and I have read and understood the race rules.";

export const MARATHON_TERMS_SECTION_TITLE = "Fitness Warranty & Race Rules and Regulations";

export const MARATHON_TERMS_VIEW_LABEL = "Click to View";

export const MARATHON_TERMS_ACCEPTANCE_LABEL =
  "You must accept the Fitness Warranty and Race Rules and Regulations.";

export interface MarathonPolicyModalContent {
  title: string;
  sections: Array<{
    heading?: string;
    items: Array<{
      title?: string;
      body: string;
    }>;
  }>;
}

export const MARATHON_FITNESS_WARRANTY_MODAL: MarathonPolicyModalContent = {
  title: MARATHON_TERMS_SECTION_TITLE,
  sections: [
    {
      heading: "Fitness Warranty",
      items: [
        {
          body: MARATHON_FITNESS_WARRANTY_TEXT,
        },
      ],
    },
    {
      heading: "Race Rules & Regulations",
      items: [
        {
          title: "Participation at Own Risk",
          body: "All athletes participate entirely at their own risk. By entering the event, athletes confirm that they are medically fit to participate and absolve Minet Lesotho (Pty) Ltd, the race organisers, sponsors, partners, and representatives from any liability arising from participation, including injury or death.",
        },
        {
          title: "Liability for Organizers",
          body: "The race organisers shall not be liable for any actions of whatsoever nature arising out of individual athletes' sponsorship by independent brands.",
        },
        {
          title: "Medical Authority",
          body: "Medical personnel have the authority to examine any participant displaying signs of distress. If, in their professional judgment, it is in the participant's best interest, they may remove the participant from the event.",
        },
        {
          title: "Next of Kin Details",
          body: "All athletes must provide the name and contact details of their next of kin at registration.",
        },
        {
          title: "Age Requirements",
          body: "5km: Minimum age 16 years. 10km: Minimum age 18 years. 21.1km: Minimum age 18 years. 42.2km: Minimum age 20 years. No persons under 16 years is permitted to participate in any race distance. All participants under 18 years must provide written consent from a parent or guardian, who must sign the registration form prior to race day. Age must be verified using an authorized ID or passport.",
        },
        {
          title: "Club Membership",
          body: "Athletes are not required to belong to a club to participate. Athletes under a club must indicate the club name on the registration form.",
        },
        {
          title: "Professional and Social Runners",
          body: "Both social and professional runners are permitted to participate. Only professional runners must obtain permits from their respective federations to qualify for prize money. Social runners are not required to obtain permits.",
        },
        {
          title: "International Athletes",
          body: "All international professional athletes must obtain permits from their respective athletic associations/federations.",
        },
        {
          title: "Compliance with Governing Bodies",
          body: "All athletes shall comply with the rules of World Athletics and the Federation of Athletics Lesotho. All protests shall be handled in accordance with these rules.",
        },
        {
          title: "Protests and Complaints",
          body: "All complaints must be lodged within 30 minutes of the official publication of results. A protest fee of M200.00 applies. Protests must be submitted in writing by a team leader, team captain, or the athlete.",
        },
        {
          title: "Race Numbers",
          body: "Athletes must wear the supplied and approved race number clearly visible on the front of their vest. Athletes who duplicate or allow duplication of their race number will be disqualified.",
        },
        {
          title: "Registration Requirement",
          body: "No athlete will be allowed to participate without official registration. An additional fee of M100.00 will be charged for any alteration made to the registered distance.",
        },
        {
          title: "Cut-Off Time",
          body: "The cut-off time for all race distances is 12:00 hrs. No athlete will be allowed to finish after this time.",
        },
        {
          title: "Prize Giving and Payment",
          body: "Winners will be announced by the race organiser at the prize-giving ceremony. Prize money will be paid electronically within two weeks, provided no complaints have been lodged. Winners must submit their ID/passport and banking details to the race organiser before payment.",
        },
        {
          title: "Entry Fees",
          body: "Entry fees are non-refundable.",
        },
        {
          title: "Prohibited Devices and Equipment",
          body: "No blades, cyclists, or mechanically operated devices are permitted. Wheelchair athletes are not permitted to participate. The use of earphones, iPods, or similar devices during the race is strictly prohibited.",
        },
        {
          title: "Animals",
          body: "No animals or pets are permitted to participate in the race.",
        },
        {
          title: "Conduct and Discipline",
          body: "Race officials and marshals must be obeyed at all times. The race organiser reserves the right to refuse entry or disqualify athletes under the influence of drugs or alcohol, those engaging in disorderly conduct, vandalism, inappropriate behaviour, or attempting to evade payment.",
        },
        {
          title: "Littering",
          body: "Littering is strictly prohibited. Athletes must dispose of waste in designated bins. Failure to comply may result in disqualification.",
        },
        {
          title: "Health and Safety Compliance",
          body: "All athletes must adhere to all health and safety regulations in force at the time of the event.",
        },
      ],
    },
    {
      heading: "Disclaimer & Data Consent",
      items: [
        {
          body: "By participating in this event, I acknowledge and agree that:",
        },
        {
          body: "I am medically fit to participate and understand the risks involved in endurance sports.",
        },
        {
          body: "I release Minet Lesotho (Pty) Ltd, its sponsors, partners, officials, and representatives from any liability arising from my participation.",
        },
        {
          body: "I authorize Minet Lesotho and its representatives to take, obtain, and use photographs, videos, and/or audio recordings of me for promotional and marketing purposes in electronic or print media without compensation or limitation.",
        },
        {
          body: "I acknowledge that my provided entry data will be shared with the event organiser and possibly third-party service providers involved in the event. Third-party service providers may include, but are not limited to: timing service providers, emergency and medical services, photographers, event planners, and insurance providers.",
        },
        {
          body: "I understand that the race organiser reserves the right to amend the rules where necessary for safety or regulatory compliance.",
        },
      ],
    },
  ],
};

export const MARATHON_SHOE_SIZE_OPTIONS = [
  "UK_1",
  "UK_2",
  "UK_3",
  "UK_4",
  "UK_5",
  "UK_6",
  "UK_7",
  "UK_8",
  "UK_9",
  "UK_10",
  "UK_11",
  "UK_12",
  "UK_13",
  "UK_14",
  "UK_15",
] as const;

export type MarathonShoeSize = (typeof MARATHON_SHOE_SIZE_OPTIONS)[number];

/** Display shoe size without underscores, e.g. UK_10 -> UK 10 */
export function formatMarathonShoeSizeLabel(size: string): string {
  return size.replace(/_/g, " ");
}
