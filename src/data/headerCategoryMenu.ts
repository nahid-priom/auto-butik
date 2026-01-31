// application
import { IMainMenuLink } from "~/interfaces/main-menu-link";
import { buildHeaderCategoryMenuFromCatalog } from "./buildHeaderCategoryMenuFromCatalog";

const dataHeaderCategoryMenu: IMainMenuLink[] = buildHeaderCategoryMenuFromCatalog();

export default dataHeaderCategoryMenu;
