module.exports = repoContributions => {
  const people = {}

  Object.values(repoContributions).forEach(contributions => {
    Object.keys(contributions).forEach(type => {
      contributions[type].forEach(person => {
        if (people[person.login]) {
          people[person.login].count += person.count
        } else {
          people[person.login] = person
        }

        people[person.login].counts = people[person.login].counts || {}
        people[person.login].counts[type] = (people[person.login].counts[type] || 0) + person.count
      })
    })
  })

  function plural (word, count) {
    if (count === 1) return word
    return `${word}s`
  }

  function getCounts (person) {
    const counts = []
    if (person.counts.commitAuthors) counts.push(`${person.counts.commitAuthors} ${plural('commit', person.counts.commitAuthors)}`)
    if (person.counts.prCreators) counts.push(`${person.counts.prCreators} ${plural('PR', person.counts.prCreators)}`)
    if (person.counts.issueCreators) counts.push(`${person.counts.issueCreators} ${plural('issue', person.counts.issueCreators)}`)
    // if (person.counts.reviewers) counts.push(`${person.counts.reviewers} ${plural('review', person.counts.reviewers)}`)
    let totalComments = (person.counts.prCommentators || 0) + (person.counts.issueCommentators || 0)
    if (totalComments) counts.push(`${totalComments} ${plural('comment', totalComments)}`)
    if (counts.length) return ` (${counts.join(', ')})`
    return ''
  }

  const sortedPeople = Object.values(people).sort((a, b) => a.login.toLowerCase().localeCompare(b.login.toLowerCase()))

  return sortedPeople
    .filter(p => p.name !== 'greenkeeper' && p.login !== 'greenkeeper')
    .filter(p => p.name !== 'azure-pipelines' && p.login !== 'azure-pipelines')
    .filter(p => p.name !== 'codecov' && p.login !== 'codecov')
    .reduce((lines, p) => {
      const counts = getCounts(p)
      if (!counts) return lines
      return lines.concat(`* [@${p.login}](${p.url})${counts}`)
    }, [])
    .join('\n')
}
