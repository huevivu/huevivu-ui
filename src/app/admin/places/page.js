import { redirect } from 'next/navigation';

export default function AdminPlacesRedirect() {
  redirect('/admin/places/new');
}
