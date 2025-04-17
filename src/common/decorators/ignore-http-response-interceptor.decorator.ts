import { SetMetadata } from "@nestjs/common/decorators";
import { IGNORE_HTTP_RESPONSE_INTERCEPTOR_META } from "../constants/metadata.contants";

export const IgnoreHttpResponseInterceptor = () =>
  SetMetadata(IGNORE_HTTP_RESPONSE_INTERCEPTOR_META, true);
