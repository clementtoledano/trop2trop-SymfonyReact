import React, {useEffect, useState} from 'react';

const Pagination = ({currentPage, itemsPerPage, length, onPageChanged}) => {

    const pagesCount = Math.ceil(length / itemsPerPage);
    const [pages, setPages] = useState([])

    useEffect(()=>{
        pagination();
    },[currentPage])

    const pagination = () => {
        let current = currentPage,
            last = pagesCount,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || i >= left && i < right) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        setPages(rangeWithDots);
    }

    return (
        <div>
            <ul className="pagination">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage - 1)}>&laquo;</button>
                </li>
                {pages.map(page => <li key={page + Math.random()} className={"page-item" + (currentPage === page && " active")}>
                    <button className="page-link" onClick={() => onPageChanged(page)}>{page}</button>
                </li>)}
                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage + 1)}>&raquo;</button>
                </li>
            </ul>
        </div>
    );
}

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage)
}
export default React.memo(Pagination);
