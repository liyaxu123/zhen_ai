import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 30, {
    message: '用户名长度必须在5到30之间',
  })
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 30, {
    message: '密码长度必须在6到30之间',
  })
  password: string;
}
