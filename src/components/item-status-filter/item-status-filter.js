import React from 'react';

import './item-status-filter.css';

const ItemStatusFilter = ({onChangeFilter}) => { 

    return (
      <div className="btn-group">
        <button type="button"
                className="btn btn-info"
                onClick={() => onChangeFilter('all')}>All</button>
        <button type="button"
                className="btn btn-outline-secondary"
                onClick={() => onChangeFilter('active')}>Active</button>
        <button type="button"
                className="btn btn-outline-secondary"
                onClick={() => onChangeFilter('done')}>Done</button>
      </div>
    );
}

export default ItemStatusFilter;
