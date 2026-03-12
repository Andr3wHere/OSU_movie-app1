const SearchBox = (props) => {
    return (
        <div className='col'>
            <input
                className='form-control'
                value={props.value}
                onChange={(event) => props.setSearchValue(event.target.value)}
                placeholder='název filmu...' />
        </div>
    )
};

export default SearchBox;