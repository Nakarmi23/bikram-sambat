// 'use client';

// import BikramSambat from '@nakarmi23/bikram-sambat';
// import { Calendar } from '@nakarmi23/react-bs-ad-calendar';
// import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
// import { useCallback, useState } from 'react';

// export const nepMonths = [
//   { id: 1, nepName: 'Baishakh' },
//   { id: 2, nepName: 'Jestha' },
//   { id: 3, nepName: 'Ashadh' },
//   { id: 4, nepName: 'Shrawan' },
//   { id: 5, nepName: 'Bhadra' },
//   { id: 6, nepName: 'Ashwin' },
//   { id: 7, nepName: 'Kartik' },
//   { id: 8, nepName: 'Mangsir' },
//   { id: 9, nepName: 'Poush' },
//   { id: 10, nepName: 'Magh' },
//   { id: 11, nepName: 'Falgun' },
//   { id: 12, nepName: 'Chaitra' },
// ];

// export const engMonths = [
//   { id: 1, engName: 'January' },
//   { id: 2, engName: 'February' },
//   { id: 3, engName: 'March' },
//   { id: 4, engName: 'April' },
//   { id: 5, engName: 'May' },
//   { id: 6, engName: 'June' },
//   { id: 7, engName: 'July' },
//   { id: 8, engName: 'August' },
//   { id: 9, engName: 'September' },
//   { id: 10, engName: 'October' },
//   { id: 11, engName: 'November' },
//   { id: 12, engName: 'December' },
// ];

// export const years = [
//   2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029,
// ];

// export const nepConstYear = [
//   2076, 2077, 2078, 2079, 2080, 2081, 2082, 2083, 2084, 2085, 2086,
// ];

// export const SimpleCalendarDemo = () => {
//   const [focusedDate, setFocusedDate] = useState<BikramSambat>(
//     BikramSambat.now()
//   );
//   const [mode, setMode] = useState<'BS' | 'AD'>('BS');
//   return (
//     <Calendar.Root
//       className='not-prose'
//       mode={mode}
//       focusedValue={focusedDate}>
//       <Calendar.Header>
//         <Calendar.Button slot='prev'>
//           <ChevronLeftIcon />
//         </Calendar.Button>
//         {/* <Calendar.Heading /> */}
//         {/* <Calendar.TypeButton /> */}
//         {mode === 'BS' ? (
//           <select
//             value={focusedDate.month() as number}
//             onChange={(event) => {
//               setFocusedDate((curr) => {
//                 return curr.month(+event.target.value) as BikramSambat;
//               });
//             }}>
//             {nepMonths.map((month) => (
//               <option value={month.id}>{month.nepName}</option>
//             ))}
//           </select>
//         ) : (
//           <select
//             value={focusedDate.adDate.getMonth() + 1}
//             onChange={(event) => {
//               setFocusedDate((curr) => {
//                 const ad = new Date(curr.adDate);
//                 ad.setMonth(+event.target.value - 1);
//                 return BikramSambat.fromAD(ad);
//               });
//             }}>
//             {engMonths.map((month) => (
//               <option value={month.id}>{month.engName}</option>
//             ))}
//           </select>
//         )}

//         {mode === 'BS' ? (
//           <select
//             value={focusedDate.year() as number}
//             onChange={(event) => {
//               setFocusedDate((curr) => {
//                 return curr.year(+event.target.value) as BikramSambat;
//               });
//             }}>
//             {nepConstYear.map((year) => (
//               <option value={year}>{year}</option>
//             ))}
//           </select>
//         ) : (
//           <select
//             value={focusedDate.adDate.getFullYear()}
//             onChange={(event) => {
//               setFocusedDate((curr) => {
//                 const ad = new Date(curr.adDate);
//                 ad.setFullYear(+event.target.value);
//                 return BikramSambat.fromAD(ad);
//               });
//             }}>
//             {years.map((year) => (
//               <option value={year}>{year}</option>
//             ))}
//           </select>
//         )}
//         <select
//           value={mode}
//           onChange={(event) => {
//             setMode(event.target.value as 'BS' | 'AD');
//             setFocusedDate(BikramSambat.now());
//           }}>
//           <option>BS</option>
//           <option>AD</option>
//         </select>
//         <Calendar.Button slot='next'>
//           <ChevronRightIcon />
//         </Calendar.Button>
//       </Calendar.Header>
//       <Calendar.Grid>
//         <Calendar.GridHeader>
//           {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
//         </Calendar.GridHeader>
//         <Calendar.GridBody>
//           {(date) => <Calendar.Cell date={date} />}
//         </Calendar.GridBody>
//       </Calendar.Grid>
//     </Calendar.Root>
//   );
// };
