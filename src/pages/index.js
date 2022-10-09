import * as React from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  ClearRefinements,
  RefinementList,
} from "react-instantsearch-dom";
import "../../styles.css";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "xyz", // Be sure to use the search-only-api-key
    nodes: [
      {
        host: "localhost",
        port: "8108",
        protocol: "http",
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    queryBy: "name",
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const IndexPage = () => {
  return (
    <div className="ais-InstantSearch">
      <h1>Boundless Resorts Search demo</h1>
      <InstantSearch indexName="resorts" searchClient={searchClient}>
        <div className="left-panel">
          <ClearRefinements />
          <h5>Transfer Type</h5>
          <RefinementList attribute="tags" />
          <Configure hitsPerPage={8} />
          <hr />
          <h5>Rooms</h5>
          <RefinementList
            transformItems={
              (items) => {
                console.log("ITEMS", items);
                return items;
              }
              // items.map((item) => ({
              //   ...item,
              //   label: item.label.toUpperCase(),
              // }))
            }
            attribute="numberOfRooms"
            limit={24}
            showMore
          />
        </div>
        <div className="right-panel">
          <SearchBox />
          <Hits hitComponent={Hit} />
          <Pagination className="pagination" />
        </div>
      </InstantSearch>
    </div>
  );
};

export default IndexPage;

const Hit = ({ hit }) => {
  return (
    <div className="card">
      <img src={hit.brandLogo} align="left" alt={hit.name} />
      <div className="name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="description">{hit.location}</div>
      <div>{hit.numberOfRooms}</div>
    </div>
  );
};
