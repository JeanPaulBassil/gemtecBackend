import { SetMetadata } from "@nestjs/common/decorators";
import { IGNORE_CACHING_META } from "../constants/metadata.contants";

export const IgnoreCaching = () => SetMetadata(IGNORE_CACHING_META, true);
