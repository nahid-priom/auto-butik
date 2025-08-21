import { gql } from '@apollo/client';
import { CountriesApi } from '~/api/base/countries.api';
import { ICountry } from '~/interfaces/country';
import { graphqlClient } from './account.api';

const GET_AVAILABLE_COUNTRIES = gql`
  query GetAvailableCountries {
    availableCountries {
      id
      code
      name
      enabled
    }
  }
`;

export class GraphqlCountriesApi extends CountriesApi {
    async getCountries(): Promise<ICountry[]> {
        const { data } = await graphqlClient.query<{ availableCountries: Array<{ code: string; name: string; enabled: boolean }> }>({
            query: GET_AVAILABLE_COUNTRIES,
            fetchPolicy: 'network-only',
        });
        return (data.availableCountries || [])
            .filter((c) => c.enabled)
            .map((c) => ({ code: c.code, name: c.name }));
    }
}

export default GraphqlCountriesApi;


