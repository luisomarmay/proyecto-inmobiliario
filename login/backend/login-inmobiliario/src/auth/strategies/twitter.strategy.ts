import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-twitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(private readonly configService: ConfigService) {
    super({
      consumerKey: configService.get<string>('TWITTER_CLIENT_ID')!,
      consumerSecret: configService.get<string>('TWITTER_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('TWITTER_CALLBACK_URL')!,
      includeEmail: true,
    });
  }

  async validate(
    token: string,
    tokenSecret: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;

    const user = {
      twitterId: id,
      email: emails?.[0]?.value || `tw_${id}@twitter.com`,
      name: displayName,
      avatar: photos?.[0]?.value || null,
    };

    done(null, user);
  }
}
