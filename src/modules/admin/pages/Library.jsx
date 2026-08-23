import React from 'react';
import LibraryFinance from './finance/LibraryFinance';

export default function Library() {
  return (
    <div>
      <div className="page-title mb-4">
        <h1>Library</h1>
        {/* <p>Library spending, book purchases and fine collection</p> */}
      </div>

      <LibraryFinance />
    </div>
  );
}
