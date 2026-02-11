// third-party
import { combineReducers } from 'redux';
// application
import version from '~/store/version';
import cartReducer, { CART_NAMESPACE } from '~/store/cart/cartReducer';
import compareReducer, { COMPARE_NAMESPACE } from '~/store/compare/compareReducer';
import currencyReducer, { CURRENCY_NAMESPACE } from '~/store/currency/currencyReducer';
import garageReducer, { GARAGE_NAMESPACE } from '~/store/garage/garageReducer';
import homepageReducer from '~/store/homepage/homepageReducer';
import { HOMEPAGE_NAMESPACE } from '~/store/homepage/homepageTypes';
import mobileMenuReducer, { MOBILE_MENU_NAMESPACE } from '~/store/mobile-menu/mobileMenuReducer';
import optionsReducer, { OPTIONS_NAMESPACE } from '~/store/options/optionsReducer';
import pageLoadReducer from '~/store/page-load/pageLoadReducer';
import { PAGE_LOAD_NAMESPACE } from '~/store/page-load/pageLoadTypes';
import loadingTrackerReducer from '~/store/loading-tracker/loadingTrackerReducer';
import { LOADING_TRACKER_NAMESPACE } from '~/store/loading-tracker/loadingTrackerTypes';
import quickviewReducer, { QUICKVIEW_NAMESPACE } from '~/store/quickview/quickviewReducer';
import shopReducer from '~/store/shop/shopReducer';
import userReducer, { USER_NAMESPACE } from '~/store/user/userReducer';
import wishlistReducer, { WISHLIST_NAMESPACE } from '~/store/wishlist/wishlistReducer';
import { SHOP_NAMESPACE } from '~/store/shop/shopTypes';

export default combineReducers({
    version: (state: number = version) => state,
    [CART_NAMESPACE]: cartReducer,
    [COMPARE_NAMESPACE]: compareReducer,
    [CURRENCY_NAMESPACE]: currencyReducer,
    [GARAGE_NAMESPACE]: garageReducer,
    [HOMEPAGE_NAMESPACE]: homepageReducer,
    [MOBILE_MENU_NAMESPACE]: mobileMenuReducer,
    [OPTIONS_NAMESPACE]: optionsReducer,
    [PAGE_LOAD_NAMESPACE]: pageLoadReducer,
    [LOADING_TRACKER_NAMESPACE]: loadingTrackerReducer,
    [QUICKVIEW_NAMESPACE]: quickviewReducer,
    [SHOP_NAMESPACE]: shopReducer,
    [USER_NAMESPACE]: userReducer,
    [WISHLIST_NAMESPACE]: wishlistReducer,
});
