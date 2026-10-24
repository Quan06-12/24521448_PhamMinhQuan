/** Fictional local records. No network requests or personal data collection. */
const records = [
  ['m01', 'Amelia Bennett', 'Product designer', 'Design', 'Active', 'London', '2023-03-14'],
  ['m02', 'Arjun Patel', 'Staff engineer', 'Engineering', 'Active', 'Singapore', '2022-09-05'],
  ['m03', 'Bianca Rossi', 'Brand designer', 'Design', 'On leave', 'Milan', '2024-01-22'],
  ['m04', 'Caleb Johnson', 'Account executive', 'Sales', 'Active', 'New York', '2023-06-12'],
  ['m05', 'Châu Nguyễn', 'Frontend engineer', 'Engineering', 'Active', 'Ho Chi Minh City', '2024-04-08'],
  ['m06', 'Daniel Kim', 'People partner', 'People', 'Active', 'Seoul', '2022-11-15'],
  ['m07', 'Elena García', 'Content strategist', 'Marketing', 'Active', 'Madrid', '2023-08-21'],
  ['m08', 'Ethan Wright', 'Data engineer', 'Engineering', 'Invited', 'Austin', '2025-02-03'],
  ['m09', 'Fatima Hassan', 'Product manager', 'Product', 'Active', 'Dubai', '2023-02-06'],
  ['m10', 'Felix Weber', 'Security engineer', 'Engineering', 'Active', 'Berlin', '2022-05-16'],
  ['m11', 'Grace Chen', 'Design researcher', 'Design', 'Active', 'Taipei', '2024-05-13'],
  ['m12', 'Hana Suzuki', 'Customer success lead', 'Sales', 'On leave', 'Tokyo', '2023-09-04'],
  ['m13', 'Ibrahim Ali', 'Platform engineer', 'Engineering', 'Active', 'London', '2022-07-18'],
  ['m14', 'Isabella Costa', 'Growth marketer', 'Marketing', 'Active', 'Lisbon', '2024-02-19'],
  ['m15', 'Jack Thompson', 'Product analyst', 'Product', 'Invited', 'Sydney', '2025-03-10'],
  ['m16', 'Jade Martin', 'People operations', 'People', 'Active', 'Paris', '2023-04-17'],
  ['m17', 'Kai Andersen', 'Backend engineer', 'Engineering', 'Active', 'Copenhagen', '2024-06-03'],
  ['m18', 'Lara Müller', 'Design systems lead', 'Design', 'Active', 'Berlin', '2022-10-24'],
  ['m19', 'Liam O’Connor', 'Sales operations', 'Sales', 'Active', 'Dublin', '2023-11-13'],
  ['m20', 'Linh Trần', 'Quality engineer', 'Engineering', 'On leave', 'Hanoi', '2024-03-25'],
  ['m21', 'Maya Robinson', 'Product director', 'Product', 'Active', 'New York', '2021-08-09'],
  ['m22', 'Mateo Silva', 'Motion designer', 'Design', 'Active', 'São Paulo', '2024-07-15'],
  ['m23', 'Nadia Ahmed', 'Talent specialist', 'People', 'Invited', 'London', '2025-04-07'],
  ['m24', 'Noah Wilson', 'Solutions engineer', 'Sales', 'Active', 'Toronto', '2023-10-02'],
  ['m25', 'Olivia Park', 'Lifecycle marketer', 'Marketing', 'Active', 'Seoul', '2024-08-12'],
  ['m26', 'Oscar Laurent', 'Infrastructure lead', 'Engineering', 'Active', 'Paris', '2022-01-31'],
  ['m27', 'Priya Sharma', 'Research operations', 'Design', 'Active', 'Bengaluru', '2023-07-10'],
  ['m28', 'Rafael Santos', 'Partnerships lead', 'Sales', 'On leave', 'Lisbon', '2023-12-04'],
  ['m29', 'Sofia Ivanova', 'Product designer', 'Design', 'Active', 'Amsterdam', '2024-09-09'],
  ['m30', 'Theo Williams', 'Engineering manager', 'Engineering', 'Active', 'London', '2021-06-21'],
  ['m31', 'Yara Haddad', 'Communications lead', 'Marketing', 'Active', 'Dubai', '2024-10-14'],
  ['m32', 'Zoe Taylor', 'Workplace coordinator', 'People', 'Invited', 'Melbourne', '2025-05-05'],
];

export const members = Object.freeze(records.map(
  ([id, name, title, team, status, location, joined]) =>
    Object.freeze({ id, name, title, team, status, location, joined }),
));

export const columns = Object.freeze([
  { header: 'Member', accessorKey: 'name', sortable: true },
  { header: 'Team', accessorKey: 'team', sortable: true },
  { header: 'Status', accessorKey: 'status', sortable: true },
  { header: 'Location', accessorKey: 'location', sortable: true },
  { header: 'Joined', accessorKey: 'joined', sortable: true },
].map(Object.freeze));
