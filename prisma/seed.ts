// import { BookingTimes, PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const incomingOptions = [
//   "ವಿದ್ಯಾ ನಿಧಿ",
//   "ಗುರುಪೂಜೆ",
//   "ಸಹಾಯಧನ",
//   "ವಾರ್ಷಿಕೋತ್ಸವ / ಗುರುಜಯಂತಿ / ಭಜನಾಮಂಗಲೋತ್ಸವ",
//   "ಶಾಶ್ವತ ಪೂಜೆ",
//   "ಇತರ ಆದಾಯ",
//   "ವಿದ್ಯಾರ್ಥಿ ವೇತನ",
//   "ಬ್ಯಾಂಕ್",
//   "ಕಾಣಿಕೆ ಡಬ್ಬಿ",
//   "ಬಡ್ಡಿ",
//   "ಡಿವಿಡೆಂಡ್",
// ];

// const outgoingOptions = [
//   "ಕಟ್ಟಡ ನಿರ್ವಹಣೆ",
//   "ಸಿಬ್ಬಂದಿ ವೇತನ",
//   "ವಿದ್ಯಾರ್ಥಿ ವೇತನ",
//   "ವಿದ್ಯುತ್ ಬಿಲ್",
//   "ವಿದ್ಯುತ್ ನಿರ್ವಹಣೆ",
//   "ಶುಚಿತ್ವ / ಕೂಲಿ",
//   "ಸಹಾಯಧನ/ಜಾಹಿರಾತು",
//   "ಪೀಠೋಪಕರಣ / ಖರೀದಿ / ಇತ್ಯಾದಿ ವಸ್ತು ಖರೀದಿ",
//   "ಮುದ್ರಣ/ಜೆರಾಕ್ಸ್ / ಟಪಾಲು / ಸ್ಟೇಷನರಿ",
//   "ದಿನಪತ್ರಿಕೆ / ಬಿಲ್",
//   "ಜನರೇಟರ್ ನಿರ್ವಹಣೆ",
//   "ಅಭಿನಂದನೆ / ಗೌರವ ಪುರಸ್ಕಾರ",
//   "ಲೆಕ್ಕ ಪರಿಶೋಧಕರ ವೆಚ್ಚು",
//   "ಪೂಜಾ ಸಾಮಗ್ರಿ",
//   "ವಾರ್ಷಿಕೋತ್ಸವ ಹಾಗು ಇನಿತ ಕಾರ್ಯಕ್ರಮ ಖರ್ಚು",
//   "ಕಟ್ಟಡ ತೆರಿಗೆ",
//   "ಮಹಾಸಭೆ ಖರ್ಚು",
//   "ಇತರ ಖರ್ಚು",
// ];

// async function main() {
//   try {
//     // Seeding Memberships
//     await prisma.memberships.createMany({
//       data: Array.from({ length: 50 }, (_, index) => ({
//         name: `Member ${index + 1}`,
//         address: `Address ${index + 1}`,
//         date: `2024-11-26`,
//         type: index % 3 === 0 ? "ajeeva" : index % 3 === 1 ? "poshaka" : "mrutha",
//         receiptno: 1000 + index,
//         photo: `https://utfs.io/f/SVkywvr9y613jkgmVVBN8aJPgDbCAkQ3VmIfG9eUXsF2coMS`,
//       })),
//     });

// // Seeding Ledger
// await prisma.ledger.createMany({
//   data: Array.from({ length: 50 }, (_, index) => {
//     const day = (index + 1).toString().padStart(2, '0'); // Ensures day has two digits
//     return {
//       TransactionType: index % 2 === 0 ? "incoming" : "outgoing",
//       TransactionHeader:
//         index % 2 === 0
//           ? incomingOptions[index % incomingOptions.length] ?? "Default Value"
//           : outgoingOptions[index % outgoingOptions.length] ?? "Default Value",
//       Amount: (index + 1) * 100,
//       ReceiptNumber: 2000 + index,
//       date: `2024-11-${day}`, // Includes padded day
//     };
//   }),
// });


// // Seeding Bhajane
// await prisma.bhajane.createMany({
//   data: Array.from({ length: 50 }, (_, index) => {
//     const day = (index + 1).toString().padStart(2, '0'); // Ensures day has two digits
//     return {
//       date: `2024-11-${day}`, // Includes padded day
//       name: `Bhajan ${index + 1}`,
//     };
//   }),
// });


//     // Seeding HallBooking
//     await prisma.hallBooking.createMany({
//       data: Array.from({ length: 50 }, (_, index) => ({
//         BookingDate: `2024-12-${index + 1}`,
//         BookingType:
//           index % 3 === 0
//             ? "marriagereceptionengagement"
//             : index % 3 === 1
//             ? "lastrites"
//             : "other",
//         BookingNote: `Booking note for event ${index + 1}`,
//         BookingTIme: ''
//       })),
//     });

//     // Seeding Gallery
//     await prisma.gallery.createMany({
//       data: Array.from({ length: 50 }, (_,) => ({
//         imagePath: `https://utfs.io/f/SVkywvr9y613CGO0eAFvbcPd3SwNR4eOXqAmU8KujiL0Qxs7`,
//         uploadDate: new Date(),
//       })),
//     });

//     // Seeding CommitteeCore
//     await prisma.committeeCore.createMany({
//       data: Array.from({ length: 50 }, (_, index) => ({
//         Post: `Post ${index + 1}`,
//         Name: `Core Member ${index + 1}`,
//         photo: `https://utfs.io/f/SVkywvr9y613jkgmVVBN8aJPgDbCAkQ3VmIfG9eUXsF2coMS`,
//       })),
//     });

//     // Seeding CommitteeMembers
//     await prisma.committeeMembers.createMany({
//       data: Array.from({ length: 50 }, (_, index) => ({
//         Name: `Committee Member ${index + 1}`,
//       })),
//     });

//     console.log('Seed data successfully added!');
//   } catch (error) {
//     console.error('Error during seeding: ', error);
//     process.exit(1);
//   } finally {
//     // Ensure Prisma disconnects when done
//     await prisma.$disconnect();
//   }
// }

// // Run the main function and handle the promise correctly
// main().catch((error) => {
//   console.error('Uncaught error: ', error);
// });
