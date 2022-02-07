import axios from 'axios';
import * as Url from 'url';
import { Logger } from '../../Common/Logger';

import { UsernameFromUrl } from '../../Common/Util';
import { StreamExtractor } from '../Plugin';

export interface VTokenInfo {
    status: number;
    token: string;
    app: string;
    edge_servers: string[];
    stream_name: string;
    private_servers: string[];
    aspect_ratio: string;
    c2c_server: string;
}

export class CamsodaExtractor implements StreamExtractor {
    private readonly VTOKEN_RESOURCE = 'https://www.camsoda.com/api/v1/video/vtoken/';
    public async Extract(url: string): Promise<string> {
        try {
            return this.ExtractPlaylist(url);
        } catch (e) {
            return '';
        }
    }
    public CanParse(uri: string): boolean {
        const hostname = Url.parse(uri).hostname;

        if (typeof hostname !== 'string') {
            return false;
        }

        return hostname.toLowerCase().endsWith('camsoda.com');
    }
    private async ExtractPlaylist(url: string) {
        const username = UsernameFromUrl(url);
        const vt = await (await axios.get<VTokenInfo>(this.VTOKEN_RESOURCE + username)).data;

        if (vt.edge_servers.length === 0)
            return '';

        const host = vt.edge_servers[0];
//        return `https://${host}/${this.Prefix(vt.stream_name)}_h264_aac_${this.Quality(vt.stream_name)}/index.m3u8?token=${vt.token}`;
// v1a2 = 144p, v2a2 = 240p, v3a2 = 480p, v4a2 = 720p ... the following is 720p all the time
        return `https://${host}/${this.Prefix(vt.stream_name)}_v1/tracks-v4a2/mono.m3u8?token=${vt.token}`;
    }
    private Prefix(streamName: string) {
        return streamName.includes('/') ?
            streamName :
            '/cam/mp4:' + streamName;
    }
    private Quality(streamName: string) {
        return streamName.includes('/') ?
            '720p' :
            '480p'
    }
}
