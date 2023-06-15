import { cookies } from 'next/headers'
 
export default function GetCookie() {
  const cookieStore = cookies()
  const theme = cookieStore.get('authorization')
  return '...'
}