/**
 * Orientation video script — Elevate for Humanity Barber Apprenticeship Program
 * Narrated scene-by-scene. Each scene maps to a b-roll clip key.
 * Facts sourced directly from the student handbook and program pages.
 */

export interface OrientationScene {
  heading: string;
  clipKey: string;
  narration: string;
}

export const ORIENTATION_SCENES: OrientationScene[] = [
  {
    heading: 'Welcome',
    clipKey: 'barbershop-intro',
    narration: `Welcome to the Elevate for Humanity Barber Apprenticeship Program. You made a decision to invest in yourself — and we take that seriously. This orientation will walk you through everything you need to know before your first day: how the program works, what is expected of you, and how to succeed. Watch this video in full. The information here is not repeated anywhere else.`,
  },
  {
    heading: 'About the Program',
    clipKey: 'apprentice-training',
    narration: `This is a United States Department of Labor Registered Apprenticeship. That means it is federally recognized, employer-sponsored, and leads directly to your Indiana barber license. The program is 2,000 hours of on-the-job training completed inside a licensed partner barbershop, combined with related technical instruction through this LMS. At full-time — 40 hours per week — that is approximately one year. Part-time schedules take longer. You earn a wage while you train. You graduate with a credential that employers and the state of Indiana recognize.`,
  },
  {
    heading: 'Your Pay',
    clipKey: 'client-retention',
    narration: `Your host shop decides your pay — not Elevate. The law sets the floor: you must be paid at least minimum wage, which is seven dollars and twenty-five cents per hour. Above that, your host shop chooses the model. Some shops pay hourly. Some pay commission. Some use a hybrid — hourly to start, then commission once your skills are strong enough to build a clientele. That conversation happens between you and your host shop before your first shift. Get clarity on it upfront. Elevate handles program administration, theory training, and DOL compliance — not your paycheck. If you have a pay dispute, contact your program coordinator.`,
  },
  {
    heading: 'Your Barber Kit',
    clipKey: 'barber-cutting-hair',
    narration: `You are responsible for your own barber kit. Elevate provides a recommended tool list and can help connect you with funding sources if needed — but the tools are yours to obtain before your first floor shift. Do not show up to your host shop without your tools. Talk to your program coordinator before your start date if you need help sourcing your kit.`,
  },
  {
    heading: 'Enrollment and ITIN',
    clipKey: 'barber-license-exam',
    narration: `You do not need a Social Security Number to enroll. Elevate accepts an ITIN — an Individual Taxpayer Identification Number — in place of an SSN for program enrollment. If you have questions about your enrollment documents, contact your program coordinator before your start date.`,
  },
  {
    heading: 'Your Supervising Barber',
    clipKey: 'apprentice-training',
    narration: `Inside your host shop, a licensed Indiana barber is designated as your supervisor. They verify your hours and competencies, provide hands-on training guidance, and sign off on your weekly progress reports. They must hold a valid Indiana barber license. Respect their time and their expertise. They are your primary mentor on the floor. If you have a conflict with your supervising barber, contact your Elevate program coordinator — do not let it go unaddressed.`,
  },
  {
    heading: 'Clocking In and Out',
    clipKey: 'logging-hours-timesheet',
    narration: `Every single shift starts and ends the same way — you clock in when you arrive and you clock out when you leave. No exceptions. You do this through the student portal on your phone or device before you touch a single client. When you clock in, the system logs your start time. When you clock out, it logs your end time and calculates your hours for that shift. If you forget to clock in, that shift does not count. If you forget to clock out, your hours will be flagged and your coordinator will need to manually review it. Do not make that a habit. Clock in when you walk in. Clock out when you walk out. Every time.`,
  },
  {
    heading: 'Logging and Verifying Your Hours',
    clipKey: 'logging-hours-timesheet',
    narration: `Your logged hours are submitted to your supervising barber for verification at the end of each week. They review your time entries and sign off. Once verified, those hours are reported to the DOL RAPIDS system — the federal database that tracks your apprenticeship progress toward your 2,000-hour requirement. You can see your running total in the student portal at any time. If there is ever a discrepancy between your log and your supervisor's records, it must be resolved before the weekly submission closes. Do not wait. Falsifying hours — logging time you did not work — is grounds for immediate dismissal and removal from the RAPIDS system. There is no appeal for that.`,
  },
  {
    heading: 'Attendance',
    clipKey: 'time-management-barber',
    narration: `Minimum 80% attendance is required to stay enrolled. Arriving or leaving more than 15 minutes outside your scheduled time counts as a half-absence. If you are receiving WIOA funding, your attendance records are submitted directly to the Indiana Department of Workforce Development. Falling below 80% can suspend your funding — and Elevate cannot override that. If you need to miss a session, contact your program coordinator before the absence, not after. Three consecutive unexcused absences trigger a probation notice. A fourth may result in dismissal.`,
  },
  {
    heading: 'Professional Conduct',
    clipKey: 'professional-appearance',
    narration: `You are training to enter a licensed profession. The standards in this program mirror what employers expect on the floor. Arrive on time. Dress appropriately per your program dress code. Treat every client, instructor, and fellow apprentice with respect. No recording of instructors, staff, or fellow students without explicit consent. Harassment, bullying, or discrimination of any kind results in immediate dismissal — no warning, no appeal. Violence, weapons, or illegal substances on any training site result in the same. There is no second chance for those violations.`,
  },
  {
    heading: 'Academic Integrity',
    clipKey: 'state-board-exam-prep',
    narration: `Your credentials mean something because they are earned. All submitted work must be your own. Plagiarism or cheating on any exam results in immediate dismissal. Submitting AI-generated content as your own original work is prohibited. Do not share exam questions or assessment materials with other students. Do not share your LMS login with anyone. Your account is yours alone — sharing it is academic dishonesty.`,
  },
  {
    heading: 'Related Technical Instruction — Theory',
    clipKey: 'state-board-exam-prep',
    narration: `On-the-job training is only half of this program. The other half is Related Technical Instruction — RTI. This is the theory side, and it is required. You must complete a minimum of 260 hours of RTI to satisfy your DOL apprenticeship requirements. All of it is delivered through this LMS. Your RTI covers everything the Indiana State Board will test you on: hair cutting techniques including fades, tapers, and razor work. Shaving and facial hair grooming. Scalp treatments and hair care. Sanitation, sterilization, and Indiana health code. Business management and client relations. And full state board exam preparation. You do not get to skip the theory because you are good with clippers. The license exam is written and practical. You need both. Complete your lessons. Take the quizzes. Do the work.`,
  },
  {
    heading: 'The LMS — Your Student Portal',
    clipKey: 'scope-of-practice',
    narration: `All of your coursework lives here — in this LMS at elevateforhumanity.org. Log in to complete lessons, track your progress, submit assignments, log your hours, and access your program documents including this handbook. Your RTI lessons are organized by module. Work through them in order. Do not skip ahead. Each module builds on the last, and your checkpoints must be passed before you can advance. If you have a technical issue, report it to your program coordinator immediately — do not wait until a deadline passes.`,
  },
  {
    heading: 'Safety on the Floor',
    clipKey: 'ppe-barber',
    narration: `Safety is not optional. During hands-on training you are required to follow all safety protocols and wear personal protective equipment when instructed. This includes gloves when handling chemicals or when there is any risk of blood exposure. If you cut yourself or a client, follow the blood exposure protocol immediately — gloves on, stop the service, clean and cover the wound, document the incident same day. If you see an unsafe condition, report it to your instructor immediately. Do not wait.`,
  },
  {
    heading: 'Sanitation Standards',
    clipKey: 'disinfecting-clippers',
    narration: `Indiana state law requires that all tools be properly disinfected between every client. Clippers, shears, combs, and razors must be cleaned and disinfected using an EPA-registered disinfectant with the correct contact time. Single-use items — razor blades, neck strips — are disposed of after every client. Your station is wiped down between every client. These are not suggestions. They are state board requirements, and they will be tested on your licensing exam.`,
  },
  {
    heading: 'After 2,000 Hours — Your License',
    clipKey: 'indiana-license-renewal',
    narration: `When you complete your 2,000 hours, you are eligible to sit for the Indiana State Board barber license exam administered by the Indiana Professional Licensing Agency — the IPLA. The exam covers theory, sanitation, and practical skills. Everything you learn in this program prepares you for it. Many host shops hire their apprentices as licensed barbers after completion. That is the goal. Finish your hours. Pass your exam. Get your license.`,
  },
  {
    heading: 'Your Rights',
    clipKey: 'ethics-professional',
    narration: `You have rights as a student in this program. The right to a safe and respectful learning environment. The right to inspect your educational records under FERPA. The right to reasonable accommodations for documented disabilities under the ADA — request them at enrollment, not after you are struggling. The right to file a grievance without retaliation. And the right to nondiscrimination under WIOA Section 188 — Elevate does not discriminate on the basis of race, color, religion, sex, national origin, age, disability, or any other protected characteristic.`,
  },
  {
    heading: 'Grievance Process',
    clipKey: 'handling-complaints',
    narration: `If you have a complaint, start with your program coordinator. Most issues are resolved within two business days. If it is unresolved within five business days, submit a written grievance by email to elevate4humanityedu at gmail dot com with the subject line Student Grievance. Elevate will respond in writing within ten business days. You can also reach us by phone at 317-314-3757, or visit us at 8888 Keystone Crossing, Suite 1300, Indianapolis, Indiana. Filing a grievance will not affect your enrollment status and will not result in retaliation of any kind.`,
  },
  {
    heading: 'How to Succeed',
    clipKey: 'smart-goals-planning',
    narration: `Here is what separates apprentices who finish from those who do not. Clock in every shift — on time. Log your hours the same day. Complete your LMS lessons on schedule. Ask questions before you fall behind — not after. Communicate with your coordinator proactively, not reactively. You chose this program because you want a career in barbering. Two thousand hours from now, you will have a license, a skill set, and a future. We are here to help you get there. Now let's get to work.`,
  },
];
