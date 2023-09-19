// export const MOCK_GOOGLE_USER = {
//   id: 'auth_provider_id',
//   display_name: 'first_name last_name',
//   familyName: 'last_name',
//   givenName: 'first_name',
//   email: 'test@gmail.com'
// };

export const MOCK_GOOGLE_USER = {
  id: 'auth_provider_id',
  displayName: 'first_name last_name',
  name: { familyName: 'last_name', givenName: 'first_name' },
  emails: [{ value: 'test@gmail.com', verified: true }],
};
