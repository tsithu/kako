import getTypeDefs from './type-defs'
import getResolvers from './resolvers'
import getSubscriptions from './subscriptions'
import getSchemaDirectives from './directives'
import getModules from '$/modules/graphql-modules'
import getLoaders from './loaders'
import getValidationRules from './validation-rules'

export default config => {
  const modules = getModules(config)
  const typeDefs = getTypeDefs(modules)
  const resolvers = getResolvers(modules)
  const subscriptions = getSubscriptions(config)
  const schemaDirectives = getSchemaDirectives(modules)
  const loaders = getLoaders(modules)
  const validationRules = getValidationRules(config.api)
  const resolverValidationOptions = {
    requireResolversForResolveType: false
  }

  return {
    typeDefs, resolvers, subscriptions, resolverValidationOptions, schemaDirectives, loaders, validationRules
  }
}

// postgraphile -o -c postgres://dbu_gold_master:password123@localhost:5432/gold_master_oms --simple-collections omit -q /api/graphql -i /api/graphiql
