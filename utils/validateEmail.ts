//------best if need for role...

// function validateEmail(email: string) {
//   if (email.endsWith("@iert.ac.in")) {
//     return "student";
//   } else if (email.endsWith("@faculty.iert.ac.in")) {
//     return "faculty";
//   } else {
//     return null; // invalid
//   }
// }


/** Temporary relaxed email validation: allow any properly formatted email. */
export function isInstituteEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Domain restriction is intentionally disabled for now.
  // return (
  //   email.endsWith("@iert.ac.in") ||
  //   email.endsWith("@faculty.iert.ac.in")
  // );
  return true;
}
