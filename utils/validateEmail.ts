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


/** Institutional addresses allowed to use OnlyCampus (must match roster + domain). */
export function isInstituteEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  return (
    email.endsWith("@iert.ac.in") ||
    email.endsWith("@faculty.iert.ac.in")
  );
}

