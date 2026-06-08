import React, { FC } from 'react';
import { StatisticsWidget3 } from '../../../../_metronic/partials/widgets'; // Import only the necessary widget
import useSWR from 'swr';
import { fetcher } from '../../service/network';

const TotalBlogPublishedStat: FC = () => {
    const { data, error, isValidating } = useSWR('/blogs?page=0&size=1', fetcher);

    if (error) {
        return <div>Error loading data</div>;
    }

    return (
        <div className='col-xl-4'>
            <StatisticsWidget3
                href={`#`} // Adjust href as needed
                className='card-xl-stretch mb-xl-8'
                color='info'
                title='Blogs Published'
                description='Weekly Total Blogs Published'
                change={`${data?.page?.totalElements || 0}`} // Use optional chaining to safely access nested properties
            />
            {isValidating && <div>Loading...</div>} {/* Optional: Show a loading indicator */}
        </div>
    );
};

export { TotalBlogPublishedStat };
