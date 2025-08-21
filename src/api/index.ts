// import { FakeAccountApi } from './fake-api/fake-account.api';
import customerApi from './graphql/account.api';
import { FakeBlogApi } from './fake-api/fake-blog.api';
// import { FakeCountriesApi } from './fake-api/fake-countries.api';
import GraphqlCountriesApi from './graphql/countries.api';
import { FakeShopApi } from './fake-api/fake-shop.api';
import { FakeVehicleApi } from './fake-api/fake-vehicle.api';

export const accountApi = customerApi;
export const blogApi = new FakeBlogApi();
export const countriesApi = new GraphqlCountriesApi();
export const shopApi = new FakeShopApi();
export const vehicleApi = new FakeVehicleApi();
