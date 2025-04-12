export const authorRelation = `authors(*)`
export const tagRelation = `tags(*)`
export const tracksRelation = `tracks(*)`

export const mixtapeAuthorsRelation = 'mixtapes_authors(*)'
export const mixtapeAuthorsWithAuthorsRelation = `mixtapes_authors(*, author:authors(*))`

export const mixtapeTagsRelation = 'mixtapes_tags(*)'
export const mixtapeTagsWithTagsRelation = `mixtapes_tags(*, tag:tags(*))`
