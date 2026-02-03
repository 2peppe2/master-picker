const GuidePage = async function ({
  searchParams,
}: {
  searchParams: { program?: string; year?: string };
}) {
  const program = searchParams.program ?? null;
  const year = searchParams.year ?? null;

  // async work here
  return <div>{program} {year}</div>;
}

export default GuidePage;