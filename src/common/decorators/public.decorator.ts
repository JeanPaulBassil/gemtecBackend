import { SetMetadata } from "@nestjs/common/decorators";
import { IS_PUBLIC_KEY_META } from "../constants/metadata.contants";

export const Public = () => SetMetadata(IS_PUBLIC_KEY_META, true);
