import { fetchReports } from '@/lib/serverActions/report';

export default async function Reports() {
  const reports = await fetchReports();

  return (
    <div className='flex flex-col justify-center align-middle gap-4 p-5'>
      <h3 className='text-center font-extrabold text-xl'>Recent Littering Reports</h3>
      {reports.map((report, i) => {
        return (
          <a href={report.path} className='no-underline' key={i}>
            <div className='px-3 py-2'>
              <h6>Report {i}</h6>
            </div>
          </a>
        );
      })}
      {!reports.length && <h5 className='text-center'>No data</h5>}
    </div>
  );
}
