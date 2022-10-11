import * as React from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  RangeInput,
  Pagination,
  ClearRefinements,
  RefinementList,
} from "react-instantsearch-hooks-web";
import { RangeSlider } from "../components";
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
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center">
        Boundless Resorts Search
      </h1>

      <InstantSearch
        indexName="resorts"
        searchClient={searchClient}
        // onStateChange={(state) => {}}
        // onStateChange={(state) => {
        //   console.log("TEST STATE", state);
        //   return state;
        // }}
      >
        <SearchBox
          translations={{
            submitButtonTitle: "Envoyer",
          }}
          classNames={{
            root: "p-3",
            form: "relative flex",
            input: "border-2 border-solid border-black  text-center w-full p-2",
            submitIcon: "ml-2 w-4 h-4 align-middle",
          }}
        />
        <div className="container grid gap-20 grid-cols-3 p-3">
          <div>
            <ClearRefinements />
            <div className="my-10">
              <h5 className="my-4">Transfer Type</h5>
              <RefinementList attribute="tags" />
              <Configure hitsPerPage={8} />
            </div>
            <hr />
            <div className="my-10">
              <h5 className="my-4">Rooms</h5>
              <RefinementList
                attribute="numberOfRooms"
                limit={24}
                // showMore
                // showMoreLimit={25}
              />
            </div>
            <hr />

            <RangeSlider attribute="numberOfRooms" />
          </div>
          <div className="col-span-2">
            <Hits
              hitComponent={Hit}
              classNames={{
                list: "flex flex-wrap",
              }}
            />

            <Pagination className="pagination" />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

export default IndexPage;

const Hit = ({ hit }) => {
  return (
    <div className="flex justify-center w-100 min-h-sm">
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
        <img src={hit.brandLogo} align="left" alt={hit.name} />
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
          {hit.name}
        </h5>
        <p className="text-gray-700 text-base mb-4">{hit.location}</p>
        <p>{hit.numberOfRooms}</p>
        {/* <button
          type="button"
          className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Button
        </button> */}
      </div>
    </div>
  );
};
