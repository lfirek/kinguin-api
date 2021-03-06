import { expect } from 'chai';
import 'mocha';
import Kinguin, { IProductFilter } from './index';
import MockAdapter from 'axios-mock-adapter'
import getProductListResponse from './__mocks__/getProductListResponse';
import getProductResponse from './__mocks__/getProductResponse';
import placeOrderResponse from './__mocks__/placeOrderResponse';
import getKeyResponse from './__mocks__/getKeyResponse';
import getDispatchIDResponse from './__mocks__/getDispatchIDResponse';

describe('Kinguin API', () => {

    describe('createUrl', () => {
        it('check sandbox URL', () => {
            const api = new Kinguin("", false, "");
            const url = api.createUrl(false, "v1")
            expect(url).to.equals("https://api.api-sandbox.kinguin.info/integration/v1")
        });

        it('check prod URL', () => {
            const api = new Kinguin("", true, "");
            const url = api.createUrl(true, "v1")
            expect(url).to.equals("https://api2.kinguin.net/integration/v1")
        });

    });

    describe('getProductList', () => {
        it('check plain request', (done) => {
            const api = new Kinguin("test", false, "v1");
            const mock = new MockAdapter(api.axiosInstance);
            mock.onGet('/products').reply(200, getProductListResponse)

            api.getProductList().then((response) => {
                expect(response.config.headers['api-ecommerce-auth']).equals("test");
                done();
            })
        });

        it('check all filters', (done) => {
            const api = new Kinguin("test", false, "v1");
            const mock = new MockAdapter(api.axiosInstance);
            mock.onGet('/products').reply(200, getProductListResponse)
            const filter: IProductFilter = {
                page: 1,
                limit: 10,
                name: "Battlefield",
                sortBy: "price",
                sortType: "ASC",
                priceFrom: 10.11,
                priceTo: 21.37
            }
            api.getProductList(filter).then((response) => {
                expect(response.config.headers['api-ecommerce-auth']).equals("test");
                expect(response.config.params).to.deep.equals(filter);
                done();
            })
        });

    });


    describe('getProductDetails', () => {
        it('check plain request', (done) => {
            const api = new Kinguin("test", false, "v1");
            const mock = new MockAdapter(api.axiosInstance);
            mock.onGet('/products/15').reply(200, getProductResponse)
            api.getProductDetails(15).then((response) => {
                expect(response.config.headers['api-ecommerce-auth']).equals("test");
                expect(response.data).to.deep.equals(getProductResponse);
                expect(response.config.url).to.equals('/products/15')
                done();
            })
        });
    });

    describe('placeOrder', () => {
        it('check plain request', (done) => {
            const api = new Kinguin("test", false, "v1");
            const mock = new MockAdapter(api.axiosInstance);
            mock.onPost('/order').reply(200, placeOrderResponse)
            const products = [
                {
                    kinguinId: 4985,
                    qty: 1,
                    name: "Gentlemen! Steam CD Key",
                    price: 2.18
                }
            ]
            api.placeOrder(products).then((response) => {
                expect(response.config.headers['api-ecommerce-auth']).equals("test");
                expect(response.data).to.deep.equals(placeOrderResponse);
                expect(response.config.data).to.deep.equals(JSON.stringify({ products : products }));
                done();
            })
        });
    });

    describe('getDispatchID', () => {
        it('check plain request', (done) => {
            const api = new Kinguin("test", false, "v1");
            const mock = new MockAdapter(api.axiosInstance);
            mock.onPost('/order/dispatch').reply(200, getDispatchIDResponse)
            api.getDispatchID(1).then((response) => {
                expect(response.config.headers['api-ecommerce-auth']).equals("test");
                expect(response.data).to.deep.equals(getDispatchIDResponse);
                done();
            })
        });
    });

    describe('getKey', () => {
        it('check plain request', (done) => {
            const api = new Kinguin("test", false, "v1");
            const mock = new MockAdapter(api.axiosInstance);
            mock.onGet('/order/dispatch/keys').reply(200, getKeyResponse)
            api.getKey(1).then((response) => {
                expect(response.config.headers['api-ecommerce-auth']).equals("test");
                expect(response.data).to.deep.equals(getKeyResponse);
                expect(response.config.params).to.deep.equals({
                    dispatchId: 1
                });
                done();
            })
        });
    });

});

