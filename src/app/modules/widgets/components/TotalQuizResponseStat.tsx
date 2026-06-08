import React, { FC } from 'react';
import { StatisticsWidget3 } from '../../../../_metronic/partials/widgets';
import useSWR from 'swr';
import { fetcher } from '../../service/network';

const TotalQuizResponseStat: FC = () => {
    const { data, error, isValidating } = useSWR('/quiz?page=0&size=1', fetcher);

    if (error) {
        return <div>Error loading data</div>;
    }

    return (
        <div className='col-xl-4'>
            <StatisticsWidget3
                href={`#`} // Adjust href as needed
                className='card-xl-stretch mb-xl-8'
                color='success'
                title='Quiz Response'
                description='Your Weekly Total Quiz Response'
                change={`${data?.page?.totalElements || 0}`} // Use optional chaining to safely access nested properties
            />
            {isValidating && <div>Loading...</div>} {/* Optional: Show a loading indicator */}
        </div>
    );
};

export { TotalQuizResponseStat };
