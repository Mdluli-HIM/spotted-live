type ListingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { listingId } = await params;

  return <div>Listing detail page: {listingId}</div>;
}
