# altv-async-discord-auth
 An asynchronous Discord auth example for alt:V written in TypeScript

 ## Important
  - This code must be running in the main resource of your server, it can not be used from another resource as exported resources does not support asynchronous. However if you still want to use it from another resource, you will need to use events to make it talk with your main resource.
  - This code is an example and you might need to modify it as your needs. You might want to increase time before promise auto expires or you might want to use a different generator for `requestId`

### Example Usage
```typescript
alt.on('playerConnect', (player: alt.Player) => {
  auth
    .startAuth(player, 'appId')
    .then((discordUser: auth.DiscordUser) => {
      alt.log(discordUser);
    })
    .catch((err: any) => {
      //
    })
})
```