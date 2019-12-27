module.exports = {
    name: 'when',
    description: 'Joined at',
    execute(msg, args) {
        msg.channel.send(msg.member.joinedAt.toString());
    }
}
